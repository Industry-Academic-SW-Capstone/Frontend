import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";

export const useCapacitor = () => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initCapacitor();
    }
  }, []);

  const initCapacitor = async () => {
    console.log("Initializing Capacitor...");

    // Request permission for Push Notifications
    const permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== "granted") {
      // try requesting again
      const newStatus = await PushNotifications.requestPermissions();
      if (newStatus.receive !== "granted") {
        console.log("User denied permissions!");
        return;
      }
    }

    // Register with Apple / Google to receive push via APNS/FCM
    await PushNotifications.register();

    // Listen for registration success
    PushNotifications.addListener("registration", (token) => {
      console.log("Push registration success, token: " + token.value);
      // TODO: Send token to backend
    });

    // Listen for registration error
    PushNotifications.addListener("registrationError", (error) => {
      console.log("Error on registration: " + JSON.stringify(error));
    });

    // Listen for push notification received
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Push received: " + JSON.stringify(notification));
        // Show local notification if needed, or let the OS handle it
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || "Stock-it",
              body: notification.body || "",
              id: new Date().getTime(),
              schedule: { at: new Date(Date.now() + 100) },
              extra: notification.data,
            },
          ],
        });
      }
    );

    // Listen for push notification tapped
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("Push action performed: " + JSON.stringify(notification));
        const url = notification.notification.data.url;
        if (url) {
          window.location.href = url;
        }
      }
    );
  };
};
