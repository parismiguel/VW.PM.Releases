import axiosInstance from "../axiosConfig";

export const getReleaseById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/releases/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching release:", error);
    throw error;
  }
};

export const validateReleaseVersion = async (version) => {
  try {
    const response = await axiosInstance.get(`/api/releases/validate-version/${version}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error validating release version";
  }
};

export const updateRelease = async (id, releaseData) => {
  try {
    const response = await axiosInstance.put(`/api/releases/${id}`, releaseData);
    return response.data;
  } catch (error) {
    console.error("Error updating release:", error);
    throw error;
  }
};