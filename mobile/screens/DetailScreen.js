import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function DetailScreen({ route, navigation }) {
  const { job } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{job.title}</Text>
            {job.badge && (
              <View style={[styles.badge, { backgroundColor: job.badgeColor === 'red' ? '#ff4d4f' : '#722ed1' }]}>
                <Text style={styles.badgeText}>{job.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.location}>{job.location}</Text>
          <Text style={styles.date}>등록일: {job.date}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>근무 조건</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>급여</Text>
            <Text style={styles.infoValue}>{job.wage}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>근무 시간</Text>
            <Text style={styles.infoValue}>{job.hours}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>근무 요일</Text>
            <Text style={styles.infoValue}>{job.days}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>상세 내용</Text>
          <Text style={styles.description}>
            어르신을 모실 따뜻한 마음을 가진 요양보호사님을 구합니다.{'\n\n'}
            - 주요 업무: 어르신 식사 및 활동 보조, 말벗 등{'\n'}
            - 자격 요건: 요양보호사 자격증 소지자{'\n'}
            - 우대 사항: 관련 경력자 우대{'\n\n'}
            많은 지원 부탁드립니다.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.likeButton} onPress={() => alert('찜목록에 추가되었습니다.')}>
          <Text style={styles.likeButtonText}>🤍 찜하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={() => {
          Alert.alert("지원 완료", "지원이 완료되었습니다.", [{ text: "확인", onPress: () => navigation.goBack() }]);
        }}>
          <Text style={styles.applyButtonText}>지원하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 20,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#444',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  likeButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  likeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  applyButton: {
    flex: 2,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
