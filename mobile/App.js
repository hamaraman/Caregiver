import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, BackHandler, Platform, View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// 안드로이드 에뮬레이터: 10.0.2.2
// 실제 기기(USB 연결): PC의 IP 주소 (예: 192.168.0.x)
const WEBVIEW_URL = 'http://localhost:3000';

export default function App() {
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onAndroidBackPress = () => {
      if (webviewRef.current && canGoBack) {
        webviewRef.current.goBack();
        return true;
      }
      return false;
    };

    let backHandler;
    if (Platform.OS === 'android') {
      backHandler = BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    }

    return () => {
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>연결 실패 😢</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorHelp}>
            1. frontend 폴더에서 'npm run dev'가 실행 중인지 확인해 주세요. (포트가 5173인지도 확인)
          </Text>
          <Text style={styles.errorHelp}>
            2. 만약 에뮬레이터가 아닌 '실제 스마트폰'을 연결하셨다면 주소를 10.0.2.2가 아닌 PC의 IP로 변경해야 합니다.
          </Text>
        </View>
      )}
      <WebView
        ref={webviewRef}
        source={{ uri: WEBVIEW_URL }}
        style={{ flex: error ? 0 : 1 }}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setError(`Error: ${nativeEvent.description} (Code: ${nativeEvent.code})`);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setError(`HTTP Error: ${nativeEvent.statusCode}`);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffe6e6'
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10
  },
  errorMessage: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center'
  },
  errorHelp: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center'
  }
});
