import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, Linking, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

const DEFAULT_URL = (Constants?.expoConfig?.extra as any)?.WEB_URL || 'http://localhost:3000';

export default function App() {
  const webviewRef = useRef<WebView>(null);
  const [uri, setUri] = useState<string>(DEFAULT_URL);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  const injectedJS = useMemo(() => `
    (function() {
      // Bridge for status bar styling and safe areas if needed
      true;
    })();
  `, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    webviewRef.current?.reload();
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  // Android hardware back button handling
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        webviewRef.current?.goBack();
        return true; // handled
      }
      return false; // default behavior (exit)
    });
    return () => sub.remove();
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      <View style={styles.webviewContainer}>
        <WebView
          ref={webviewRef}
          source={{ uri }}
          originWhitelist={["*"]}
          allowsBackForwardNavigationGestures
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          pullToRefreshEnabled
          onRefresh={onRefresh}
          onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
          onShouldStartLoadWithRequest={(request) => {
            // Open external links in the system browser, keep same-origin in app
            try {
              const reqUrl = new URL(request.url);
              const baseUrl = new URL(uri);
              const sameOrigin = reqUrl.origin === baseUrl.origin;
              if (!sameOrigin && (request.navigationType !== 'backForward')) {
                Linking.openURL(request.url);
                return false;
              }
            } catch {}
            return true;
          }}
          onError={(e) => {
            console.warn('WebView error', e.nativeEvent);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webviewContainer: {
    flex: 1,
  },
});
