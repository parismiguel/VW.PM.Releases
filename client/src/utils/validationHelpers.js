/**
 * Validates a semantic version string.
 * @param {string} value - The version string to validate.
 * @returns {string} An error message if invalid, or an empty string if valid.
 */
export const validateSemver = (value) => {
    const semverRegex = /^\d+\.\d+\.\d+\.\d+$/;
    if (!semverRegex.test(value)) {
      return "Release version must follow the semver format (e.g., 3.1.186.0).";
    }
    return "";
  };