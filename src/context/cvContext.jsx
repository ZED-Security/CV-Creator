import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from 'react';

// --- Initial State ---
const initialState = {
  personal: {
    name: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
  },
  summary: '',
  skills: '',
  education: [],
  experience: [],
  projects: [], // ✅ Added projects
};

// --- Action Types ---
const ACTIONS = {
  UPDATE_PERSONAL: 'UPDATE_PERSONAL',
  UPDATE_SUMMARY: 'UPDATE_SUMMARY',
  UPDATE_SKILLS: 'UPDATE_SKILLS',
  UPDATE_EDUCATION: 'UPDATE_EDUCATION',
  UPDATE_EXPERIENCE: 'UPDATE_EXPERIENCE',
  UPDATE_PROJECTS: 'UPDATE_PROJECTS', // ✅ Added projects action
  SET_CV_DATA: 'SET_CV_DATA',
  RESET_CV: 'RESET_CV',
};

// --- Reducer ---
function cvReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_PERSONAL:
      return {
        ...state,
        personal: {
          ...state.personal,
          [action.payload.field]: action.payload.value,
        },
      };

    case ACTIONS.UPDATE_SUMMARY:
      return {
        ...state,
        summary: action.payload,
      };

    case ACTIONS.UPDATE_SKILLS:
      return {
        ...state,
        skills: action.payload,
      };

    case ACTIONS.UPDATE_EDUCATION:
      return {
        ...state,
        education: action.payload,
      };

    case ACTIONS.UPDATE_EXPERIENCE:
      return {
        ...state,
        experience: action.payload,
      };

    case ACTIONS.UPDATE_PROJECTS: // ✅ Handle projects update
      return {
        ...state,
        projects: action.payload,
      };

    case ACTIONS.SET_CV_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case ACTIONS.RESET_CV:
      return initialState;

    default:
      return state;
  }
}

// --- Create Context ---
const CvContext = createContext(null);

// --- Provider Component ---
export const CvProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cvReducer, initialState, (init) => {
    try {
      const stored = localStorage.getItem('cvData');
      return stored ? JSON.parse(stored) : init;
    } catch {
      return init;
    }
  });

  // --- Persist state to localStorage ---
  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(state));
  }, [state]);

  // --- Action Dispatchers ---
  const updatePersonal = (field, value) => {
    dispatch({ type: ACTIONS.UPDATE_PERSONAL, payload: { field, value } });
  };

  const updateSummary = (summary) => {
    dispatch({ type: ACTIONS.UPDATE_SUMMARY, payload: summary });
  };

  const updateSkills = (skills) => {
    dispatch({ type: ACTIONS.UPDATE_SKILLS, payload: skills });
  };

  const updateEducation = (educationArray) => {
    dispatch({ type: ACTIONS.UPDATE_EDUCATION, payload: educationArray });
  };

  const updateExperience = (experienceArray) => {
    dispatch({ type: ACTIONS.UPDATE_EXPERIENCE, payload: experienceArray });
  };

  const updateProjects = (projectsArray) => {
    dispatch({ type: ACTIONS.UPDATE_PROJECTS, payload: projectsArray });
  };

  const setCvData = (newData) => {
    dispatch({ type: ACTIONS.SET_CV_DATA, payload: newData });
  };

  const resetCv = () => {
    dispatch({ type: ACTIONS.RESET_CV });
  };

  // --- Context Value ---
  const contextValue = useMemo(
    () => ({
      cvData: state,
      updatePersonal,
      updateSummary,
      updateSkills,
      updateEducation,
      updateExperience,
      updateProjects, // ✅ Expose to consumers
      setCvData,
      resetCv,
    }),
    [state]
  );

  return (
    <CvContext.Provider value={contextValue}>{children}</CvContext.Provider>
  );
};

// --- Custom Hook ---
export const useCV = () => {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error('useCV must be used within a CvProvider');
  }
  return context;
};
