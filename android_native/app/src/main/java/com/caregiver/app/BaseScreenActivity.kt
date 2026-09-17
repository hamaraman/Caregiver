package com.caregiver.app

import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar

// 홈/상세/찜/마이페이지 등 보조 화면 공통 툴바(제목 + 뒤로가기)를 한 곳에서 관리.
abstract class BaseScreenActivity : AppCompatActivity() {

    protected fun setupToolbar(title: String) {
        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = title
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressedDispatcher.onBackPressed()
        return true
    }
}
