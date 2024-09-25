export const isActive = async (): Promise<boolean> => {
    try {
        const response = await fetch("/api/users/session", { method: "GET", credentials: "include" });
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data.active; 
    } catch (error) {
        console.error("Error checking session active status:", error);
        return false;
    }
};
