import { useEffect } from "react";
import api from "@/utils/axios";
import { useUser } from "@/stores/user";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const setUser = useUser((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/api/me");
        console.log(data);
        setUser(data);
      } catch (error) {
        navigate("/login");
        console.error(error);
      }
    };
    fetchUser();
  }, [setUser, navigate]);

  return <Outlet />;
}

export default App;
