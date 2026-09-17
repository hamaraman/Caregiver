package com.caregiver.app

import android.os.Bundle

class FavoritesScreenActivity : BaseScreenActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_favorites_screen)
        setupToolbar(getString(R.string.title_favorites))
        // mobile/screens/FavoritesScreen.js의 로직을 이곳에 포팅하세요.
    }
}
