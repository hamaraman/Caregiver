package com.caregiver.app

import android.os.Bundle

class MyPageScreenActivity : BaseScreenActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_my_page_screen)
        setupToolbar(getString(R.string.title_my_page))
        // mobile/screens/MyPageScreen.js의 로직을 이곳에 포팅하세요.
    }
}
