import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const usePrompt = (message, when) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = message; // Show a confirmation dialog
    };

    const handleNavigation = (e) => {
      if (!window.confirm(message)) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [when, message, navigate, location]);
};

export default usePrompt;