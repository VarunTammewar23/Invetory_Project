import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert } from "react-native";
import { Camera, useCameraDevices, CameraDevice, CameraPermissionStatus } from "react-native-vision-camera";
import { useScanBarcodes, BarcodeFormat } from "vision-camera-code-scanner";

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(false);

  const devices: CameraDevice[] = useCameraDevices(); // array of devices
  // find the back camera manually
  const backCamera = devices.find(device => device.position === "back");

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    const requestPermission = async () => {
      const status: CameraPermissionStatus = await Camera.requestCameraPermission();
      setHasPermission(status === "granted");
    };
    requestPermission();
  }, []);

  useEffect(() => {
    if (barcodes.length > 0 && barcodes[0].displayValue) {
      Alert.alert("QR Code scanned!", barcodes[0].displayValue);
    }
  }, [barcodes]);

  if (!backCamera || !hasPermission) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        device={backCamera}
        isActive={true}
        frameProcessor={frameProcessor as any} // safe cast
      />
    </SafeAreaView>
  );
}
