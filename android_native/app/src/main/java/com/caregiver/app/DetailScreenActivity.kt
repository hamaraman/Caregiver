package com.caregiver.app

import android.os.Bundle

class DetailScreenActivity : BaseScreenActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail_screen)
        setupToolbar(getString(R.string.title_detail))
        // mobile/screens/DetailScreen.js의 로직을 이곳에 포팅하세요.
    }
}
