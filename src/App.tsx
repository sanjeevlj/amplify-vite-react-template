import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [devices, setDevices] = useState<Array<Schema["Device"]["type"]>>([]);

  useEffect(() => {
    // Fetch devices for the current user
    const subscription = client.models.Device.observeQuery({
      username: user?.signInDetails?.loginId, // Filter devices by username
    }).subscribe({
      next: (data) => setDevices([...data.items]),
    });

    return () => subscription.unsubscribe(); // Clean up subscription on unmount
  }, [user]);

  function createDevice() {
    const deviceID = window.prompt("Enter Device ID:");
    const typeOfUser = window.prompt("Enter Type of User:");
    const remarks = window.prompt("Enter Remarks (optional):");

    if (deviceID && typeOfUser) {
      client.models.Device.create({
        username: user?.signInDetails?.loginId,
        deviceID,
        typeOfUser,
        remarks,
      });
    }
  }

  function deleteDevice(id: string) {
    client.models.Device.delete({ id });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s Devices</h1>
      <button onClick={createDevice}>+ Add New Device</button>
      <ul>
        {devices.map((device) => (
          <li key={device.id}>
            <strong>Device ID:</strong> {device.deviceID} <br />
            <strong>Type of User:</strong> {device.typeOfUser} <br />
            <strong>Remarks:</strong> {device.remarks || "N/A"} <br />
            <button onClick={() => deleteDevice(device.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={signOut}>Sign Out</button>
    </main>
  );
}

export default App;
