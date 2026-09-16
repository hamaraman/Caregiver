import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { mockJobs } from '../data/mockData';

export default function HomeScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network request
    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 500);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetail', { job: item })}
      activeOpacity={0.8}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        {item.badge && (
          <View style={[styles.badge, { backgroundColor: item.badgeColor === 'red' ? '#ff4d4f' : '#722ed1' }]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.jobLocation}>{item.location}</Text>
      <Text style={styles.jobDetails}>{item.wage} • {item.hours} • {item.days}</Text>
      <View style={styles.jobFooter}>
        <Text style={styles.jobDate}>{item.date}</Text>
        <TouchableOpacity style={styles.likeBtn} onPress={() => alert('찜목록에 추가되었습니다.')}>
          <Text>🤍</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>공고가 없습니다.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  jobDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  jobDate: {
    fontSize: 12,
    color: '#999',
  },
  likeBtn: {
    padding: 4,
  },
});
