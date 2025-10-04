import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, collection, query, limit, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { AirVent, HeartPulse, User, Loader2, BookOpen, ChevronRight, AlertTriangle, CheckCircle, X, BarChart3, Scale } from 'lucide-react';

// --- Global Variable Definitions (Mandatory Canvas Variables) ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : undefined;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-auracast-app';
const apiKey = ""; // API Key for Google services (will be automatically provided by the platform)

// Utility function for exponential backoff (for API resilience)
const exponentialBackoff = async (fn, maxRetries = 5, delay = 1000) => {
for (let i = 0; i < maxRetries; i++) {
try {
return await fn();
} catch (error) {
if (i === maxRetries - 1) throw error;
await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
}
}
};

/**

Custom hook to initialize Firebase and manage authentication state.
*/
const useFirebase = () => {
const [db, setDb] = useState(null);
const [auth, setAuth] = useState(null);
const [userId, setUserId] = useState(null);
const [isAuthReady, setIsAuthReady] = useState(false);

useEffect(() => {
if (Object.keys(firebaseConfig).length === 0) return;

try {
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const authInstance = getAuth(app);

  setDb(firestore);
  setAuth(authInstance);

  const unsubscribe = onAuthStateChanged(authInstance, (user) => {
    if (user) {
      setUserId(user.uid);
    } else {
      // Sign in anonymously if no token is available or user is logged out
      const authenticate = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(authInstance, initialAuthToken);
          } else {
            await signInAnonymously(authInstance);
          }
        } catch (error) {
          console.error("Firebase Auth failed:", error);
        } finally {
          setIsAuthReady(true);
        }
      };
      authenticate();
    }
  });

  return () => unsubscribe();
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

}, []);

// Update userId once auth is complete
useEffect(() => {
if (auth && !userId && isAuthReady && auth.currentUser) {
setUserId(auth.currentUser.uid);
}
if (isAuthReady && !userId && auth && !auth.currentUser) {
// Fallback for anonymous sign-in failure (shouldn't happen with the logic above)
setUserId(crypto.randomUUID());
}
}, [auth, userId, isAuthReady]);

return { db, auth, userId, isAuthReady };
};

// --- Static Data & Helper Functions ---

const SYMPTOM_OPTIONS = [
'Cough', 'Shortness of breath', 'Wheezing', 'Chest tightness',
'Sneezing', 'Itchy eyes', 'Runny nose', 'Rashes', 'Headache', 'Fatigue', 'Other'
];

/**

Generates a simulated insight based on user data and current AQI.

@param {Array<Object>} symptoms - Array of logged symptoms.

@param {Object} currentAQI - Current simulated air quality status.

@returns {string} - A personalized smart insight.
*/
const getSmartInsight = (symptoms, currentAQI) => {
if (symptoms.length < 3) {
return "Log at least 3 symptoms to unlock personalized analytics and correlation heatmaps!";
}

const maxSeverity = symptoms.reduce((max, s) => Math.max(max, s.severity || 0), 0);

if (maxSeverity >= 4 && currentAQI.aqiValue > 70 && currentAQI.pollutants['PM2.5'] > 20) {
return **Insight: Headaches & $\text{PM}_{2.5}$** You tend to experience high symptom severity (Severity ${maxSeverity}) when $\text{PM}_{2.5}$ levels are above $\mathbf{20\ \mu g/m^3}$ (currently ${currentAQI.pollutants['PM2.5']} $\mu g/m^3$). We recommend using an air purifier today.;
} else if (currentAQI.aqiValue < 50) {
return **Positive Trend:** Your symptoms have been relatively mild lately, coinciding with **Good (AQI ${currentAQI.aqiValue})** air quality. Keep up the clean air routines!;
} else {
return **Tracking In Progress:** We've logged ${symptoms.length} entries. We are building your personal correlation model focusing on $\text{O}_3$ and $\text{NO}_2$ levels.;
}
};

// --- Daily Air Story Generator (LLM API Call) ---

const generateAirStory = async (healthStatus, symptomHistory) => {
const apiUrl = https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey};

// Summarize recent symptoms with severity
const recentSymptoms = symptomHistory.slice(0, 3).map(s => ${s.type} (Sev: ${s.severity})).join(', ') || "None reported in the last day.";

const query = `Generate a personalized daily air story based on the following data:

Current Local Air Quality: ${healthStatus.aqiText} (AQI ${healthStatus.aqiValue})

Primary Pollutant: ${healthStatus.primaryPollutant}

Recent Symptoms (last 24h): ${recentSymptoms}

Create a compassionate, non-alarming 2-3 paragraph narrative. Give a concise summary, link it gently to the air quality if necessary, and suggest one small, positive action (e.g., 'Consider an indoor walk today').`;

const systemPrompt = "You are 'Auracast Storyteller', a compassionate and knowledgeable AI. Your role is to transform raw air quality and health data into an encouraging, personalized daily narrative for the user. Focus on easy-to-understand summaries and positive, proactive actions. Keep the total response under 150 words.";

const payload = {
contents: [{ parts: [{ text: query }] }],
systemInstruction: {
parts: [{ text: systemPrompt }]
},
};

try {
const response = await exponentialBackoff(async () => {
const fetchResponse = await fetch(apiUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
});
if (!fetchResponse.ok) {
throw new Error(API call failed with status: ${fetchResponse.status});
}
return fetchResponse;
});

const result = await response.json();
const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
return text || "Error generating air story.";

} catch (error) {
console.error("LLM Generation Error:", error);
return "The Auracast Storyteller is resting. Check back soon for your daily summary!";
}
};

// --- App Component ---

const App = () => {
const { db, userId, isAuthReady } = useFirebase();

// State for Member 3's functionalities
const [airStory, setAirStory] = useState("Tap 'Generate Story' to get your personalized Air Story!");
const [isLoadingStory, setIsLoadingStory] = useState(false);
const [symptoms, setSymptoms] = useState([]);
const [newSymptomData, setNewSymptomData] = useState({
type: 'Cough', // Default symptom
severity: 3,   // 1-5 scale
duration: '',
notes: '',
});
const [alertMessage, setAlertMessage] = useState(null);

// Simulated data from Member 2's Data & AI Specialist module (Expanded Environmental Context)
const healthStatus = useMemo(() => ({
aqiValue: 85,
aqiText: "Moderate",
primaryPollutant: "Ozone (O 
3
​
 )",
healthRisk: "Sensitive groups should reduce outdoor activity.",
color: 'bg-yellow-500',
icon: <AlertTriangle className="w-6 h-6 text-white" />,
// Detailed Pollutants & Weather
pollutants: {
'PM2.5': 28, // µg/m³ - elevated in moderate air
'PM10': 55, // µg/m³
'O3': 0.08, // ppm
'NO2': 0.03, // ppm
'CO': 3.1, // ppm
'SO2': 0.005, // ppm
},
weather: {
temp: '22°C',
humidity: '65%',
wind: '5 mph NW',
pollenIndex: 'High',
}
}), []);

// Update symptom data from form inputs
const handleSymptomChange = (e) => {
const { name, value } = e.target;

setNewSymptomData(prev => ({
  ...prev,
  [name]: name === 'severity' 
    ? (value === '' ? '' : parseInt(value)) // FIX: Set to empty string if input is cleared to prevent NaN warning
    : value
}));

};

// 1. Fetch Symptoms (Real-Time Firestore Listener)
useEffect(() => {
if (!db || !userId) return;

const symptomsCollectionPath = `artifacts/${appId}/users/${userId}/symptoms`;
// NOTE: Sorting is done here. If an error regarding missing index occurs,
// this can be removed and sorting performed in client-side JS (setSymptoms).
const symptomsQuery = query(
  collection(db, symptomsCollectionPath),
  orderBy("timestamp", "desc"),
  limit(20) // Only fetch the 20 most recent entries
);

const unsubscribe = onSnapshot(symptomsQuery, (snapshot) => {
  const fetchedSymptoms = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate().toLocaleString() || 'N/A'
  }));
  setSymptoms(fetchedSymptoms);
}, (error) => {
  console.error("Error fetching symptoms:", error);
});

return () => unsubscribe();

}, [db, userId]);

// 2. Symptom Tracker Logic (Structured Data Save)
const addSymptom = useCallback(async (e) => {
e.preventDefault();

// Convert severity to number for validation/storage, handling the case where it might be a string ''
const severityNum = newSymptomData.severity === '' ? NaN : parseInt(newSymptomData.severity);

if (!db || !userId || !newSymptomData.type || isNaN(severityNum) || severityNum < 1 || severityNum > 5) {
    console.warn("Attempted to add symptom with invalid data. Severity must be between 1 and 5.", newSymptomData);
    setAlertMessage({ type: 'error', text: 'Please ensure all required fields are filled, and Severity is a number between 1 and 5.' });
    return;
}

const symptomsCollectionPath = `artifacts/${appId}/users/${userId}/symptoms`;

// FIX: Filter out non-serializable React elements (icon) and UI-specific data (color) 
// from healthStatus before saving to Firestore.
const { color, icon, ...serializableHealthStatus } = healthStatus;

try {
  await addDoc(collection(db, symptomsCollectionPath), {
    ...newSymptomData,
    severity: severityNum, // Ensure the stored value is the parsed number
    // Link symptom to comprehensive environmental context using the serializable version
    exposureData: serializableHealthStatus, 
    timestamp: serverTimestamp()
  });
  // Reset form to default, keeping the last type selected
  setNewSymptomData(prev => ({
    type: prev.type,
    severity: 3, // Reset to default number
    duration: '',
    notes: '',
  }));
  // Show confirmation alert
  setAlertMessage({ type: 'success', text: 'Symptom logged successfully and linked to environmental data!' });
} catch (error) {
  console.error("Error adding symptom:", error);
  setAlertMessage({ type: 'error', text: 'Failed to log symptom.' });
}

}, [db, userId, newSymptomData, healthStatus]);

// 3. Daily Air Story Generator
const handleGenerateStory = useCallback(async () => {
setIsLoadingStory(true);
// Use 5 most recent symptoms for brevity and context
const recentSymptoms = symptoms.filter((s, index) => index < 5);
const story = await generateAirStory(healthStatus, recentSymptoms);
setAirStory(story);
setIsLoadingStory(false);
}, [healthStatus, symptoms]);

// 4. Personalized Health Alerts (Simulated Push Notification UI)
useEffect(() => {
if (healthStatus.aqiValue > 75) {
setAlertMessage({
type: 'warning',
text: Air Quality Alert: AQI is ${healthStatus.aqiValue}. ${healthStatus.healthRisk},
});
} else {
setAlertMessage({
type: 'info',
text: 'Air quality is good. Enjoy your day outside!',
});
}
// Clear alert after 8 seconds
const timer = setTimeout(() => setAlertMessage(null), 8000);
return () => clearTimeout(timer);
}, [healthStatus]);

// Custom Alert Component
const HealthAlert = ({ message, onClose }) => {
if (!message) return null;
const { type, text } = message;

const baseClasses = "fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl transition-all duration-500 transform";
let styleClasses = "";
let Icon = CheckCircle;

switch (type) {
  case 'success':
    styleClasses = "bg-green-600 text-white";
    Icon = CheckCircle;
    break;
  case 'warning':
    styleClasses = "bg-yellow-600 text-white";
    Icon = AlertTriangle;
    break;
  case 'error':
    styleClasses = "bg-red-600 text-white";
    Icon = X;
    break;
  case 'info':
  default:
    styleClasses = "bg-blue-600 text-white";
    Icon = HeartPulse;
    break;
}

return (
  <div className={`${baseClasses} ${styleClasses} flex items-start space-x-3`}>
    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
    <div className='flex-grow'>
      <p className="font-semibold text-sm">Personalized Health Alert</p>
      <p className="text-sm">{text}</p>
    </div>
    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition duration-150">
        <X className='w-4 h-4'/>
    </button>
  </div>
);

};

if (!isAuthReady) {
return (
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
<Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
<p className="ml-3 text-indigo-600 font-medium">Initializing Auracast Health Services...</p>
</div>
);
}

return (
<div className="min-h-screen bg-gray-50 font-['Inter'] p-4 sm:p-6 lg:p-8">

  {/* Personalized Health Alerts (Simulated Push Notifications) */}
  <HealthAlert 
    message={alertMessage} 
    onClose={() => setAlertMessage(null)} 
  />

  <header className="mb-8 p-4 bg-white shadow-lg rounded-xl flex justify-between items-center sticky top-4 z-10">
    <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 flex items-center">
      <HeartPulse className="w-7 h-7 mr-2 text-indigo-600" />
      Auracast Health Hub
    </h1>
    <div className="text-xs sm:text-sm text-gray-500 flex items-center">
        <User className="w-4 h-4 mr-1"/>
        User ID: <span className="ml-1 font-mono break-all text-xs text-indigo-600">{userId}</span>
    </div>
  </header>


  <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* Column 1: Symptom Tracker & History */}
    <section className="lg:col-span-2">
      
      {/* Health Symptom Tracker Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-500">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <AirVent className="w-5 h-5 mr-2 text-emerald-500" />
          🩺 Health Symptom Tracker (Log)
        </h2>
        
        <form onSubmit={addSymptom} className="space-y-4">
          
          {/* Symptom Type and Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Symptom</label>
              <select
                id="type"
                name="type"
                value={newSymptomData.type}
                onChange={handleSymptomChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 bg-white"
              >
                {SYMPTOM_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">Severity (1-5)</label>
              <input
                id="severity"
                name="severity"
                type="number"
                min="1"
                max="5"
                value={newSymptomData.severity}
                onChange={handleSymptomChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                required
              />
            </div>
          </div>

          {/* Duration and Notes */}
          <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g., "30 mins", "All day")</label>
              <input
                id="duration"
                name="duration"
                type="text"
                value={newSymptomData.duration}
                onChange={handleSymptomChange}
                placeholder="e.g., '1 hour', 'Intermittent'"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
              />
          </div>

          <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                rows="2"
                value={newSymptomData.notes}
                onChange={handleSymptomChange}
                placeholder="Specific time, location, or medication taken..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 resize-none"
              ></textarea>
          </div>

          <button
            type="submit"
            disabled={!isAuthReady || !newSymptomData.type}
            className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
          >
            Log Symptom & Link to Environmental Context
          </button>
        </form>

        <h3 className="text-lg font-medium text-gray-700 mt-8 mb-3 border-b pb-2">Recent History</h3>
        {symptoms.length === 0 ? (
            <p className="text-gray-500 italic">No symptoms logged yet. Start tracking to build your personal exposure history.</p>
        ) : (
            <ul className="space-y-3 max-h-96 overflow-y-auto">
            {symptoms.map((symptom) => (
                <li key={symptom.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition duration-150">
                    <div className="flex justify-between items-start text-sm mb-1">
                        <p className="font-bold text-gray-800 flex items-center">
                            {symptom.type} 
                            <span className='ml-2 text-xs font-semibold text-red-600 flex items-center p-1 px-2 bg-red-100 rounded-full'>
                                Severity: {symptom.severity}
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{symptom.timestamp}</p>
                    </div>
                    {symptom.duration && <p className='text-xs text-gray-600 mb-1'>Duration: {symptom.duration}</p>}
                    {symptom.notes && <p className='text-xs italic text-gray-500 mb-1 border-t pt-1 mt-1'>Notes: {symptom.notes}</p>}
                    
                    <div className="text-xs text-indigo-600 mt-2 p-2 bg-indigo-50 rounded-lg">
                       * Context: <span className='font-semibold'>{symptom.exposureData.aqiText} (AQI {symptom.exposureData.aqiValue})</span> | {"$\text{PM}_{2.5}$"}: <span className='font-semibold'>{symptom.exposureData.pollutants['PM2.5']} {"$\mu g/m^3$"}</span>
                    </div>
                </li>
            ))}
            </ul>
        )}
      </div>
    </section>


    {/* Column 2: Daily Air Story & Analytics */}
    <section>
      
      {/* Daily Air Story */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
          "Your Daily Air Story"
        </h2>
        <div className={`p-3 rounded-lg text-sm transition-all duration-300 ${healthStatus.color}`}>
            <div className="flex items-center text-white font-semibold">
                {healthStatus.icon}
                <span className="ml-2">Local AQI: {healthStatus.aqiText} ({healthStatus.aqiValue})</span>
            </div>
        </div>
        
        <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-line text-sm min-h-[100px] flex flex-col justify-center">
            {isLoadingStory ? (
                <span className="flex items-center justify-center text-indigo-600">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating your personalized summary...
                </span>
            ) : airStory}
        </p>

        <button
            onClick={handleGenerateStory}
            disabled={isLoadingStory}
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50"
        >
            {isLoadingStory ? 'Generating...' : (
                <>
                    Generate New Story
                    <ChevronRight className="w-4 h-4 ml-1 -mr-1" />
                </>
            )}
        </button>
      </div>

      {/* Analytics & Smart Insights */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
          📊 Analytics & Smart Insights
        </h2>
        
        <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg mb-4">
            <p className="font-semibold text-purple-700 mb-2">Smart Insight:</p>
            <p className="text-sm text-purple-600">
                {getSmartInsight(symptoms, healthStatus)}
            </p>
        </div>

        <h3 className="text-lg font-medium text-gray-700 mb-3">Today's Environmental Data</h3>
        <ul className="space-y-1 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
            <li><span className='font-semibold'>AQI:</span> {healthStatus.aqiValue} ({healthStatus.aqiText})</li>
            <li><span className='font-semibold'>Primary Pollutant:</span> {healthStatus.primaryPollutant}</li>
            <li><span className='font-semibold'>{"$\text{PM}_{2.5}$"}:</span> {healthStatus.pollutants['PM2.5']} {"$\mu g/m^3$"}</li>
            <li><span className='font-semibold'>{"$\text{NO}_{2}$"}:</span> {healthStatus.pollutants['NO2']} ppm</li>
            <li><span className='font-semibold'>Weather/Pollen:</span> {healthStatus.weather.temp}, {healthStatus.weather.wind} (Pollen: {healthStatus.weather.pollenIndex})</li>
        </ul>

        {/* Medical Disclaimer */}
        <div className="mt-6 p-3 bg-red-100 border-l-4 border-red-500 rounded-lg">
            <p className="font-bold text-xs text-red-700 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1"/>
                Medical Disclaimer
            </p>
            <p className="text-xs text-red-600 mt-1">
                Auracast is not a substitute for professional medical diagnosis or advice. Always consult a healthcare provider for any health concerns.
            </p>
        </div>
      </div>
    </section>
  </main>
</div>

);
};

export default App;