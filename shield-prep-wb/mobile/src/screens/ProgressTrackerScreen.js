import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { API_URL } from '../config';

export default function ProgressTrackerScreen({ route }) {
    const { token } = route.params;
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Fetch progress data
        // For prototype, we will use the mock data from server logic
        fetch(`${API_URL}/student/progress`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    }, []);

    if (!stats) return <View style={styles.center}><Text>Loading Stats...</Text></View>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Performance Analysis</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Mock Test Scores</Text>
                {stats.mockTests.map((test, index) => (
                    <View key={index} style={styles.row}>
                        <View style={styles.testInfo}>
                            <Text style={styles.testName}>{test.testName}</Text>
                        </View>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { width: `${test.score}%`, backgroundColor: '#4CAF50' }]}>
                                <Text style={styles.barText}>{test.score}</Text>
                            </View>
                            <View style={[styles.bar, { width: `${test.avg}%`, backgroundColor: '#FFC107', marginTop: 2 }]}>
                                <Text style={styles.barText}>Avg: {test.avg}</Text>
                            </View>
                        </View>
                    </View>
                ))}
                <View style={styles.legend}>
                    <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor:'#4CAF50'}]}/><Text>Your Score</Text></View>
                    <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor:'#FFC107'}]}/><Text>State Avg</Text></View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Subject Weakness</Text>
                <Text>Based on your recent tests, you need to focus on:</Text>
                <Text style={styles.weakness}>• Physics: Rotational Motion</Text>
                <Text style={styles.weakness}>• Math: Differential Equations</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 3 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    row: { marginBottom: 15 },
    testInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    testName: { fontWeight: '600' },
    barContainer: { width: '100%' },
    bar: { height: 20, borderRadius: 4, justifyContent: 'center', paddingLeft: 5 },
    barText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    legend: { flexDirection: 'row', marginTop: 10 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
    weakness: { color: 'red', marginTop: 5, fontWeight: '500' }
});
