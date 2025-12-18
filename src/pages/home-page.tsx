import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import type { Geolocation } from "@/types/Geolocation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, X } from "lucide-react";
import api from "@/utils/axios";
import { useUser } from "@/stores/user";
import { Spinner } from "@/components/ui/spinner";

const HomePage = () => {
  const [geoInfo, setGeoInfo] = useState<Geolocation | null>(null);
  const user = useUser((state) => state.user);
  const [ipInput, setIpInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const isValidIp = (ip: string) => {
    const regex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    return regex.test(ip);
  };

  const fetchGeo = async (ip?: string) => {
    try {
      setLoading(true);
      const url = ip ? `https://ipinfo.io/${ip}/geo` : `https://ipinfo.io/geo`;
      const response = await axios.get(url);
      const status = response.status;

      if (status === 200 && ip && user?._id) {
        const { data } = await api.post("/api/geolocations/user", {
          userId: user._id,
          geolocation: response.data,
        });
        console.log(data);
      }

      setGeoInfo(response.data);
      setError("");
    } catch {
      setError("Could not fetch geolocation data.");
      setGeoInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ip = ipInput.trim();

    if (!isValidIp(ip)) {
      setError("Invalid IP address");
      setGeoInfo(null);
      return;
    }
    fetchGeo(ip);
  };

  const handleClear = () => {
    setIpInput("");
    fetchGeo(); // fetch logged-in user's IP info
  };

  useEffect(() => {
    fetchGeo();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Enter IP address"
          value={ipInput}
          onChange={(e) => setIpInput(e.target.value)}
        />
        <Button type="submit" className="flex items-center gap-1">
          <Search size={16} />
          <span>Find</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="flex items-center gap-1"
          onClick={handleClear}
        >
          <X size={16} />
          <span>Clear</span>
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Spinner className="size-3 mx-auto" />
      ) : (
        <section>
          {geoInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Geolocation Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p>
                  <strong>IP:</strong>{" "}
                  <span className="text-gray-500">{geoInfo.ip}</span>
                </p>
                <p>
                  <strong>City:</strong>{" "}
                  <span className="text-gray-500">{geoInfo.city}</span>
                </p>
                <p>
                  <strong>Region:</strong>{" "}
                  <span className="text-gray-500">{geoInfo.region}</span>
                </p>
                <p>
                  <strong>Country:</strong>{" "}
                  <span className="text-gray-500">{geoInfo.country}</span>
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  <span className="text-gray-500">{geoInfo.loc}</span>
                </p>
                <p>
                  <strong>Organization:</strong>{" "}
                  <span className="text-gray-500">{geoInfo.org}</span>
                </p>
                <p>
                  <strong>Postal:</strong>{" "}
                  <span className="text-gray-500">{geoInfo.postal}</span>
                </p>
                <p>
                  <strong>Timezone:</strong>{" "}
                  <span className="text-gray-500">{geoInfo.timezone}</span>
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      )}
    </div>
  );
};

export default HomePage;
