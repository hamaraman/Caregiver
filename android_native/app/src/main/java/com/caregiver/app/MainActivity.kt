package com.caregiver.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import android.os.Build

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        
        val webSettings: WebSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        // viewport meta 태그 존중 (width=device-width → CSS @media 모바일 쿼리 정상 작동)
        webSettings.useWideViewPort = true
        webSettings.loadWithOverviewMode = true
        
        // 간편로그인(OAuth) 시 구글/카카오 등이 웹뷰를 차단하는 것을 방지하기 위해 User-Agent에서 'wv' 제거
        webSettings.userAgentString = webSettings.userAgentString.replace("; wv", "")
        
        // 쿠키 허용 (소셜 로그인 등에서 필요)
        val cookieManager = android.webkit.CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)
        
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: android.webkit.WebResourceRequest?
            ): Boolean {
                val url = request?.url.toString()
                if (url.startsWith("intent:")) {
                    try {
                        val intent = android.content.Intent.parseUri(url, android.content.Intent.URI_INTENT_SCHEME)
                        val packageManager = view?.context?.packageManager
                        if (packageManager != null) {
                            val resolveInfo = packageManager.resolveActivity(intent, 0)
                            if (resolveInfo != null) {
                                view.context.startActivity(intent)
                            } else {
                                val fallbackUrl = intent.getStringExtra("browser_fallback_url")
                                if (fallbackUrl != null) {
                                    view.loadUrl(fallbackUrl)
                                    return true
                                }
                                val marketIntent = android.content.Intent(android.content.Intent.ACTION_VIEW)
                                marketIntent.data = android.net.Uri.parse("market://details?id=${intent.getPackage()}")
                                view.context.startActivity(marketIntent)
                            }
                            return true
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
                return super.shouldOverrideUrlLoading(view, request)
            }
        }
        webView.webChromeClient = WebChromeClient()

        // 오라클 클라우드 (Nginx + SSL 적용된 주소)
        webView.loadUrl("https://161.33.154.237.nip.io")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
