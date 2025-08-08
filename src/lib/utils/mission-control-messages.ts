// Mission Control Error Messages and Notifications
export const MISSION_CONTROL_MESSAGES = {
  // Import System Messages
  import: {
    success: {
      title: "🚀 Pre-flight Data Acquired",
      message: "Mission Control has successfully processed your resume data. All systems green!",
    },
    error: {
      title: "⚠️ Mission Control Alert",
      message: "Houston, we have a problem. Unable to process the uploaded file. Please try again.",
    },
    fileTypeError: {
      title: "❌ Incompatible Payload",
      message: "Mission Control can only process PDF, DOCX, or TXT files. Please check your file format.",
    },
    fileSizeError: {
      title: "⚠️ Payload Too Large",
      message: "Mission Control: File exceeds maximum size limit. Please use a smaller file.",
    },
    parsing: {
      title: "🔄 Data Extraction in Progress",
      message: "Mission Control is analyzing your resume data. Please standby...",
    },
  },

  // Builder Messages
  builder: {
    autoSaveSuccess: {
      title: "✅ Mission Progress Saved",
      message: "Mission Control has automatically saved your progress. Your career launch is secure!",
    },
    autoSaveError: {
      title: "⚠️ Save System Malfunction",
      message: "Mission Control warning: Unable to save progress. Please manually save your work.",
    },
    validation: {
      title: "🔍 Pre-flight Check Required",
      message: "Mission Control has detected incomplete sections. Please review before launch.",
    },
    sectionAdded: {
      title: "📋 New Section Added",
      message: "Mission Control: New section successfully added to your resume manifest.",
    },
    sectionRemoved: {
      title: "🗑️ Section Removed",
      message: "Mission Control: Section has been removed from your resume manifest.",
    },
    undoAction: {
      title: "↶ Mission Rollback Complete",
      message: "Mission Control: Previous action has been reversed. Systems restored.",
    },
    redoAction: {
      title: "↷ Mission Replay Complete",
      message: "Mission Control: Action has been reapplied. Systems updated.",
    },
  },

  // Export Messages
  export: {
    generating: {
      title: "🚀 Launch Sequence Initiated",
      message: "Mission Control: Generating your professional resume PDF. Countdown in progress...",
    },
    success: {
      title: "🎉 Career Launched!",
      message: "Mission accomplished! Your resume has been successfully generated and is ready for deployment.",
    },
    error: {
      title: "❌ Launch Sequence Aborted",
      message: "Mission Control alert: PDF generation failed. Please retry the launch sequence.",
    },
    downloading: {
      title: "⬇️ Payload Deployment",
      message: "Mission Control: Your resume is being deployed to your device. Standby...",
    },
    downloadComplete: {
      title: "✅ Payload Delivered",
      message: "Mission accomplished! Your resume has been successfully downloaded.",
    },
    templateError: {
      title: "⚠️ Template System Error",
      message: "Mission Control: Selected template is unavailable. Please choose another template.",
    },
    historyUpdated: {
      title: "📊 Mission Log Updated",
      message: "Mission Control: Export logged to your mission history.",
    },
  },

  // Template Messages
  template: {
    switched: {
      title: "🎨 Template Module Loaded",
      message: "Mission Control: New template configuration applied successfully.",
    },
    loadError: {
      title: "⚠️ Template Load Failure",
      message: "Mission Control alert: Unable to load selected template. Reverting to previous configuration.",
    },
    customization: {
      title: "⚙️ Template Customization Applied",
      message: "Mission Control: Your template modifications have been applied successfully.",
    },
  },

  // Form Validation Messages
  validation: {
    required: {
      title: "🔴 Critical Field Missing",
      message: "Mission Control: This field is required for launch clearance.",
    },
    email: {
      title: "📧 Invalid Communication Protocol",
      message: "Mission Control: Please enter a valid email address for mission communications.",
    },
    phone: {
      title: "📞 Invalid Contact Frequency",
      message: "Mission Control: Please enter a valid phone number format.",
    },
    date: {
      title: "📅 Invalid Mission Date",
      message: "Mission Control: Please enter a valid date in the correct format.",
    },
    url: {
      title: "🌐 Invalid Link Protocol",
      message: "Mission Control: Please enter a valid URL format (e.g., https://example.com).",
    },
    maxLength: {
      title: "📝 Content Exceeds Limits",
      message: "Mission Control: Content exceeds maximum character limit for optimal formatting.",
    },
    minLength: {
      title: "📝 Insufficient Content",
      message: "Mission Control: Please provide more detailed information for better results.",
    },
  },

  // System Messages
  system: {
    loading: {
      title: "🔄 System Initialization",
      message: "Mission Control systems are coming online. Please standby...",
    },
    offline: {
      title: "📡 Connection Lost",
      message: "Mission Control: Connection to servers lost. Working in offline mode.",
    },
    online: {
      title: "📡 Connection Restored",
      message: "Mission Control: Connection to servers restored. All systems operational.",
    },
    maintenanceMode: {
      title: "🔧 Maintenance in Progress",
      message: "Mission Control: System maintenance in progress. Some features may be limited.",
    },
    updateAvailable: {
      title: "🆕 System Update Available",
      message: "Mission Control: A new version is available. Please refresh for the latest features.",
    },
    sessionTimeout: {
      title: "⏰ Session Timeout Warning",
      message: "Mission Control: Your session will expire soon. Please save your work.",
    },
    sessionExpired: {
      title: "⏰ Session Expired",
      message: "Mission Control: Your session has expired. Please refresh and resume your mission.",
    },
  },

  // Success Celebrations
  celebrations: {
    resumeCompleted: {
      title: "🎉 Mission Ready for Launch!",
      message: "Outstanding work! Your resume is complete and ready to launch your career into orbit!",
    },
    firstExport: {
      title: "🚀 First Launch Success!",
      message: "Congratulations on your first successful resume export! Your career journey begins now.",
    },
    multipleExports: {
      title: "🌟 Veteran Mission Commander",
      message: "Multiple successful launches completed! You're becoming a resume export expert.",
    },
    perfectScore: {
      title: "🏆 Mission Perfection Achieved",
      message: "Perfect resume score! Mission Control is impressed with your attention to detail.",
    },
    speedRecord: {
      title: "⚡ Speed Record Achieved",
      message: "Impressive! You've completed your resume in record time. Efficiency at its finest!",
    },
  },

  // Tips and Guidance
  tips: {
    general: [
      "Mission Control Tip: Use action verbs to describe your accomplishments for maximum impact.",
      "Pro Tip: Keep descriptions concise but impactful - quality over quantity in space missions.",
      "Mission Control Advice: Tailor your resume for each job application for optimal results.",
      "Expert Tip: Use metrics and numbers to quantify your achievements whenever possible.",
      "Mission Control Reminder: Proofread carefully - attention to detail is crucial for successful missions.",
    ],
    sections: {
      experience: [
        "Mission Control: Focus on achievements, not just job duties for maximum impact.",
        "Pro Tip: Use the STAR method (Situation, Task, Action, Result) for powerful descriptions.",
        "Expert Advice: Include relevant keywords from job postings to pass ATS systems.",
      ],
      education: [
        "Mission Control: Include relevant coursework and academic achievements.",
        "Pro Tip: GPA can be included if 3.5 or higher, otherwise mission discretion advised.",
        "Expert Advice: Include certifications and relevant training programs.",
      ],
      skills: [
        "Mission Control: Balance hard and soft skills for comprehensive coverage.",
        "Pro Tip: Only include skills you can confidently discuss in interviews.",
        "Expert Advice: Organize skills by category (Technical, Management, etc.) for clarity.",
      ],
    },
  },
} as const;

// Message Type Definitions
export type MessageType = 'success' | 'error' | 'warning' | 'info' | 'celebration';

export interface MissionMessage {
  title: string;
  message: string;
  type?: MessageType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Utility Functions
export const createMissionMessage = (
  title: string,
  message: string,
  type: MessageType = 'info',
  duration = 5000
): MissionMessage => ({
  title,
  message,
  type,
  duration,
});

export const getRandomTip = (section?: keyof typeof MISSION_CONTROL_MESSAGES.tips.sections): string => {
  if (section && MISSION_CONTROL_MESSAGES.tips.sections[section]) {
    const tips = MISSION_CONTROL_MESSAGES.tips.sections[section];
    return tips[Math.floor(Math.random() * tips.length)];
  }
  
  const generalTips = MISSION_CONTROL_MESSAGES.tips.general;
  return generalTips[Math.floor(Math.random() * generalTips.length)];
};

export const formatValidationMessage = (field: string, rule: string): MissionMessage => {
  const baseMessage = MISSION_CONTROL_MESSAGES.validation[rule as keyof typeof MISSION_CONTROL_MESSAGES.validation];
  
  if (baseMessage) {
    return {
      ...baseMessage,
      type: 'warning' as MessageType,
      message: `${field}: ${baseMessage.message}`,
    };
  }
  
  return {
    title: "⚠️ Validation Alert",
    message: `Mission Control: Please check the ${field} field.`,
    type: 'warning' as MessageType,
  };
};

// Mission Status Messages
export const getMissionStatus = (completionPercentage: number): MissionMessage => {
  if (completionPercentage === 100) {
    return {
      title: "🚀 Mission Ready for Launch",
      message: "All systems green! Your resume is complete and ready for deployment.",
      type: 'celebration',
    };
  } else if (completionPercentage >= 80) {
    return {
      title: "🟡 Final Systems Check",
      message: `Mission ${completionPercentage}% complete. Final preparations underway.`,
      type: 'info',
    };
  } else if (completionPercentage >= 50) {
    return {
      title: "🟠 Mission in Progress",
      message: `Mission Control: ${completionPercentage}% complete. Maintaining steady progress.`,
      type: 'info',
    };
  } else if (completionPercentage >= 25) {
    return {
      title: "🔵 Mission Initiated",
      message: `Mission Control: ${completionPercentage}% complete. Building momentum.`,
      type: 'info',
    };
  } else {
    return {
      title: "🚀 Mission Launch Started",
      message: "Mission Control: Resume construction initiated. Let's build something amazing!",
      type: 'info',
    };
  }
};