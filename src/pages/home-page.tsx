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
import { useGeolocation } from "@/stores/geolocation";

const HomePage = () => {
  // Global states/zustans
  const user = useUser((state) => state.user);
  const selectedGeolocation = useGeolocation(
    (state) => state.selectedGeolocation
  );
  const setSelectedGeolocation = useGeolocation(
    (state) => state.setSelectedGeolocation
  );

  // States
  const [geoInfo, setGeoInfo] = useState<Geolocation | null>(null);
  const [geoRecords, setGeoRecords] = useState<Geolocation[]>([]);
  const [ipInput, setIpInput] = useState<string>("");

  // Extra stattes
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const isValidIp = (ip: string) => {
    const regex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    return regex.test(ip);
  };

  const fetchGeo = async (ip?: string) => {
    try {
      setGeoLoading(true);
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
      setGeoLoading(false);
    }
  };

  const fetchAllGeolocations = async () => {
    if (!user?._id) return;
    try {
      setRecordsLoading(true);
      const { data } = await api.get(`/api/geolocations/user/${user._id}`);
      setGeoRecords(data);
      setError("");
    } catch {
      setError("Failed to fetch geolocation records.");
    } finally {
      setRecordsLoading(false);
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
    // fetchGeo();
  }, []);

  useEffect(() => {
    fetchAllGeolocations();
  }, [user?._id]);

  return (
    <main className="grid grid-cols-3 gap-5">
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

        {geoLoading ? (
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
      <div className="my-5">
        <h1 className="text-xl font-black mb-5">History</h1>
        {recordsLoading ? (
          <Spinner className="size-3" />
        ) : (
          <section>
            {geoRecords.map((geo) => {
              return (
                <Card
                  className="my-2"
                  onClick={() => setSelectedGeolocation(geo)}
                >
                  <CardContent className="space-y-2">
                    <p>
                      <strong>ID:</strong>{" "}
                      <span className="text-gray-500">{geo._id}</span>
                    </p>
                    <p>
                      <strong>IP:</strong>{" "}
                      <span className="text-gray-500">{geo.ip}</span>
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}
      </div>

      {selectedGeolocation && (
        <div className="h-full">
          <h1 className="text-xl font-black mt-5">Geolocation Details</h1>
          <Card className="my-2">
            <CardContent className="space-y-1">
              <p>
                <strong>IP:</strong>{" "}
                <span className="text-gray-500">{selectedGeolocation.ip}</span>
              </p>
              <p>
                <strong>City:</strong>{" "}
                <span className="text-gray-500">
                  {selectedGeolocation.city}
                </span>
              </p>
              <p>
                <strong>Region:</strong>{" "}
                <span className="text-gray-500">
                  {selectedGeolocation.region}
                </span>
              </p>
              <p>
                <strong>Country:</strong>{" "}
                <span className="text-gray-500">
                  {selectedGeolocation.country}
                </span>
              </p>
              <p>
                <strong>Location:</strong>{" "}
                <span className="text-gray-500">{selectedGeolocation.loc}</span>
              </p>
              <p>
                <strong>Organization:</strong>{" "}
                <span className="text-gray-500">{selectedGeolocation.org}</span>
              </p>
              <p>
                <strong>Postal:</strong>{" "}
                <span className="text-gray-500">
                  {selectedGeolocation.postal}
                </span>
              </p>
              <p>
                <strong>Timezone:</strong>{" "}
                <span className="text-gray-500">
                  {selectedGeolocation.timezone}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
};

export default HomePage;
