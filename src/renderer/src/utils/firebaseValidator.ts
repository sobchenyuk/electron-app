export interface FirebaseConfig {
  project_id?: string;
  type?: string;
  private_key?: string;
  client_email?: string;
	  project_info?: {
	    project_number?: string;
	    firebase_url?: string;
	    project_id?: string;
	    storage_bucket?: string;
	  };
  client?: Array<any>;
}

export const validateFirebaseConfig = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (file.type !== "application/json" && !file.name.endsWith(".json")) {
    return { valid: false, error: "File must be a JSON file" };
  }

  // Check file size (max 1MB)
  if (file.size > 1024 * 1024) {
    return { valid: false, error: "File size must be less than 1MB" };
  }

  return { valid: true };
};

export const parseFirebaseConfig = async (
  file: File
): Promise<{ valid: boolean; config?: FirebaseConfig; error?: string }> => {
  // First validate file
  const fileValidation = validateFirebaseConfig(file);
  if (!fileValidation.valid) {
    return { valid: false, error: fileValidation.error };
  }

  // Try to parse JSON
  try {
    const text = await file.text();
    const config: FirebaseConfig = JSON.parse(text);

    // Check for required Firebase fields
    const hasProjectId = config.project_id || config.project_info?.project_id;
    const hasCredentials =
      config.private_key || config.client_email || config.client;

    if (!hasProjectId || !hasCredentials) {
      return {
        valid: false,
        error: "Invalid Firebase config. Missing required fields: project_id, credentials",
      };
    }

    return { valid: true, config };
  } catch (error) {
    return { valid: false, error: "Invalid JSON format" };
  }
};
