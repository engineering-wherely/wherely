import { useAssets } from "expo-asset";
import React, { useEffect, useRef, useState } from "react";
import WebView, { WebViewMessageEvent } from "react-native-webview";

type Props = {
  onMapPress: (coordinates: [number, number]) => void;
};

const MapArtisan = (props: Props) => {
  const { onMapPress } = props;
  const [assets] = useAssets([require("../assets/index.html")]);
  const [htmlString, setHtmlString] = useState<string | null>(null);

  const webViewRef = useRef<WebView | null>(null);

  useEffect(() => {
    if (assets) {
      fetch(assets[0].localUri || "")
        .then((res) => res.text())
        .then((html) => setHtmlString(html));
    }
  }, [assets]);

  const messageHandler = (e: WebViewMessageEvent) => {
    const coords = JSON.parse(e.nativeEvent.data) as [number, number];
    onMapPress(coords);
  };

  if (!htmlString) {
    return null;
  }

  return (
    <WebView
      ref={(r) => (webViewRef.current = r)}
      injectedJavaScript=""
      source={{
        html: htmlString,
      }}
      javaScriptEnabled={true}
      scrollEnabled={false}
      overScrollMode="never"
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scalesPageToFit={false}
      onMessage={messageHandler}
      onLoad={() => console.log("WebView loaded Successfully")}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error("WebView error:", nativeEvent);
      }}
    />
  );
};

export default MapArtisan;
