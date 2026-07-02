"use client";

import { useEffect } from "react";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";

export default function PushNotificationSetup() {
  useEffect(() => {
    // Only run on native Android/iOS
    if (!Capacitor.isNativePlatform()) return;

    const setupPushNotifications = async () => {
      try {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === "prompt") {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== "granted") {
          console.warn("User denied push notification permission");
          return;
        }

        await PushNotifications.register();

        PushNotifications.addListener("registration", async (token) => {
          console.log("FCM Token:", token.value);
          // Send token to backend
          try {
            await fetch("/api/save-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: token.value }),
            });
          } catch (error) {
            console.error("Failed to send token to server", error);
          }
        });

        PushNotifications.addListener("registrationError", (error) => {
          console.error("Error on registration:", error);
        });

      } catch (error) {
        console.error("Error setting up push notifications:", error);
      }
    };

    setupPushNotifications();

    // Cleanup listeners
    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, []);

  return null;
}
