package com.caregiver.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import org.json.JSONObject

class DetailScreenActivity : BaseScreenActivity() {

    companion object {
        const val EXTRA_ADDRESS = "extra_address"
        private const val KAKAO_APP_KEY = "ea8448ff08694645db2cceb709291843"
        // 카카오 앱에 플랫폼 도메인으로 등록된 실제 배포 주소.
        // WebView에서 로컬 HTML을 이 baseUrl로 로드해야 카카오맵 SDK의 도메인 검사를 통과한다.
        private const val KAKAO_ALLOWED_ORIGIN = "https://161.33.154.237.nip.io"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail_screen)
        setupToolbar(getString(R.string.title_detail))

        val address = intent.getStringExtra(EXTRA_ADDRESS) ?: "서울특별시 강남구 테헤란로 123"

        val mapWebView = findViewById<WebView>(R.id.mapWebView)
        mapWebView.settings.javaScriptEnabled = true
        mapWebView.settings.domStorageEnabled = true
        mapWebView.settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        // 지도 SDK가 조용히 실패할 때 원인을 adb logcat -s KakaoMapWebView 로 바로 볼 수 있도록.
        mapWebView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(message: ConsoleMessage): Boolean {
                Log.d("KakaoMapWebView", "${message.message()} (${message.sourceId()}:${message.lineNumber()})")
                return true
            }
        }
        mapWebView.loadDataWithBaseURL(
            KAKAO_ALLOWED_ORIGIN,
            buildMapHtml(address),
            "text/html",
            "UTF-8",
            null
        )
        // mobile/screens/DetailScreen.js의 나머지 상세 정보(급여·근무시간 등)도 이곳에 포팅하세요.
    }

    private fun buildMapHtml(address: String): String {
        val addressJson = JSONObject.quote(address)
        return """
            <!DOCTYPE html>
            <html><head><meta charset="utf-8">
            <style>html,body,#map{width:100%;height:100%;margin:0;padding:0}</style>
            </head><body>
            <div id="map"></div>
            <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=$KAKAO_APP_KEY&libraries=services&autoload=false"></script>
            <script>
            kakao.maps.load(function() {
                var geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch($addressJson, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        var map = new kakao.maps.Map(document.getElementById('map'), { center: coords, level: 3 });
                        new kakao.maps.Marker({ map: map, position: coords });
                    }
                });
            });
            </script>
            </body></html>
        """.trimIndent()
    }
}
