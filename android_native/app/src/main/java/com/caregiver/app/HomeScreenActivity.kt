package com.caregiver.app

import android.os.Bundle

class HomeScreenActivity : BaseScreenActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home_screen)
        setupToolbar(getString(R.string.title_home))
        // mobile/screens/HomeScreen.js의 로직을 이곳에 포팅하세요.
    }
}
