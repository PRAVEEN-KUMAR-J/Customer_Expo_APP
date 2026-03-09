import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CheckCircle, Circle, Package } from 'lucide-react-native';

interface StatusItem {
    id: string;
    title: string;
    time?: string;
    description?: string;
    status: 'completed' | 'active' | 'pending';
}

interface OrderStatusTimelineProps {
    statusItems: StatusItem[];
    pulseAnim: Animated.Value;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ statusItems, pulseAnim }) => {
    return (
        <View style={styles.container}>
            {statusItems.map((item, index) => (
                <View key={item.id} style={styles.timelineItem}>
                    <View style={styles.timelineIconContainer}>
                        {item.status === 'completed' && (
                            <CheckCircle size={22} color="#22C55E" fill="#22C55E" />
                        )}
                        {item.status === 'active' && (
                            <View style={styles.activeStatusIcon}>
                                <Animated.View style={[styles.activeStatusPulse, { transform: [{ scale: pulseAnim }] }]} />
                                <Package size={14} color="#FFF" />
                            </View>
                        )}
                        {item.status === 'pending' && (
                            <Circle size={22} color="#E5E7EB" />
                        )}
                        {index < statusItems.length - 1 && (
                            <View style={[styles.timelineLine, { backgroundColor: item.status === 'completed' ? '#22C55E' : '#E5E7EB' }]} />
                        )}
                    </View>
                    <View style={styles.timelineContent}>
                        <Text style={[styles.statusTitle, item.status === 'active' && { color: '#F97316' }]}>
                            {item.title}
                        </Text>
                        {item.time && <Text style={styles.statusTime}>{item.time}</Text>}
                        {item.description && <Text style={styles.statusDescription}>{item.description}</Text>}
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    timelineItem: {
        flexDirection: 'row',
    },
    timelineIconContainer: {
        alignItems: 'center',
        width: 24,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        minHeight: 30,
        marginVertical: 4,
    },
    timelineContent: {
        marginLeft: 16,
        paddingBottom: 24,
        flex: 1,
    },
    statusTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4B5563',
    },
    statusTime: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
        marginTop: 2,
    },
    statusDescription: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    activeStatusIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeStatusPulse: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
    },
});
