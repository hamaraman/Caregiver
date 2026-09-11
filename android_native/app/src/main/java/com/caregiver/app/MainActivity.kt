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
        webSettings.useWideViewPort = true
        webSettings.loadWithOverviewMode = true
        
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        // PC의 웹 서버 IP를 입력하세요 (예: http://10.78.101.220:3000)
        // 안드로이드 에뮬레이터인 경우 http://10.0.2.2:3000
        webView.loadUrl("http://10.78.101.220:3000")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
