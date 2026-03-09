import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    MapPin,
    Clock,
    Phone,
    MessageSquare,
    ChevronRight,
    Package,
    Circle,
    CheckCircle,
    MoreVertical,
    Zap
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function OrderTrackingScreen() {
    const router = useRouter();
    const { noAutoRedirect, orderId, totalPrice } = useLocalSearchParams<{ noAutoRedirect?: string; orderId?: string; totalPrice?: string }>();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // 10 second auto-redirect to home unless disabled
        if (noAutoRedirect !== 'true') {
            const timer = setTimeout(() => {
                router.replace('/(tabs)/home');
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [noAutoRedirect]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.backBtn}>
                    <ArrowLeft size={20} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Tracking Order</Text>
                    <Text style={styles.orderIdBold}>{orderId || '#ORD-77291'}</Text>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                    <MoreVertical size={20} color="#111827" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Current Order Batch Section (Replacing Map) */}
                <View style={styles.batchSection}>
                    <LinearGradient
                        colors={['#FFF7ED', '#FFEDD5']}
                        style={styles.batchGradient}
                    >
                        <View style={styles.batchHeader}>
                            <View style={styles.pulseContainer}>
                                <Animated.View style={[styles.statusPulse, { transform: [{ scale: pulseAnim }] }]} />
                                <View style={styles.statusInner} />
                            </View>
                            <Text style={styles.batchStatusText}>In transit • 24 mins left</Text>
                        </View>

                        <View style={styles.batchItemsContainer}>
                            <View style={styles.batchItemCard}>
                                <Package size={24} color="#F97316" />
                                <View style={styles.batchItemTexts}>
                                    <Text style={styles.batchItemTitle}>Grocery Batch #1</Text>
                                    <Text style={styles.batchItemMeta}>Fresh Vegetables & Fruits</Text>
                                </View>
                                <Zap size={18} color="#F97316" />
                            </View>

                            <View style={[styles.batchItemCard, { marginTop: 12, opacity: 0.7 }]}>
                                <Package size={24} color="#9CA3AF" />
                                <View style={styles.batchItemTexts}>
                                    <Text style={[styles.batchItemTitle, { color: '#6B7280' }]}>Dairy Batch #2</Text>
                                    <Text style={styles.batchItemMeta}>Milk & Cheese (Packed)</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Driver Details */}
                <View style={styles.driverCard}>
                    <View style={styles.driverInfo}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop' }}
                            style={styles.driverImage}
                        />
                        <View style={styles.driverTexts}>
                            <Text style={styles.driverName}>Rahul Sharma</Text>
                            <Text style={styles.driverRole}>Your delivery partner</Text>
                        </View>
                    </View>
                    <View style={styles.driverActions}>
                        <TouchableOpacity style={styles.actionCircle}>
                            <Phone size={20} color="#F97316" fill="#F97316" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionCircle, { marginLeft: 12 }]}>
                            <MessageSquare size={20} color="#F97316" fill="#F97316" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Order Summary Section */}
                <View style={styles.detailsPreview}>
                    <View style={styles.previewLeft}>
                        <View style={styles.itemsIconBg}>
                            <Package size={20} color="#F97316" />
                        </View>
                        <View>
                            <Text style={styles.previewTitle}>Order Details</Text>
                            <Text style={styles.previewSubtitle}>Arriving Shortly</Text>
                        </View>
                    </View>
                    <Text style={styles.bigBoldPrice}>₹{totalPrice || '245.00'}</Text>
                </View>

                {/* Tracking Timeline */}
                <View style={styles.timelineCard}>
                    <Text style={styles.cardTitle}>Order Status</Text>

                    <View style={styles.timelineItem}>
                        <View style={styles.timelineIconContainer}>
                            <CheckCircle size={22} color="#22C55E" fill="#22C55E" />
                            <View style={[styles.timelineLine, { backgroundColor: '#22C55E' }]} />
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={styles.statusTitle}>Order Placed</Text>
                            <Text style={styles.statusTime}>10:24 AM</Text>
                        </View>
                    </View>

                    <View style={styles.timelineItem}>
                        <View style={styles.timelineIconContainer}>
                            <View style={styles.activeStatusIcon}>
                                <Animated.View style={[styles.activeStatusPulse, { transform: [{ scale: pulseAnim }] }]} />
                                <Package size={14} color="#FFF" />
                            </View>
                            <View style={[styles.timelineLine, { backgroundColor: '#E5E7EB' }]} />
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={[styles.statusTitle, { color: '#F97316' }]}>Preparing your order</Text>
                            <Text style={styles.statusTime}>In Progress</Text>
                        </View>
                    </View>

                    <View style={styles.timelineItem}>
                        <View style={styles.timelineIconContainer}>
                            <Circle size={22} color="#E5E7EB" />
                            <View style={[styles.timelineLine, { backgroundColor: '#E5E7EB' }]} />
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={styles.statusTitle}>Out for Delivery</Text>
                            <Text style={styles.statusDescription}>Rider will pick up soon</Text>
                        </View>
                    </View>

                    <View style={styles.timelineItem}>
                        <View style={styles.timelineIconContainer}>
                            <Circle size={22} color="#E5E7EB" />
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={styles.statusTitle}>Delivered</Text>
                            <Text style={styles.statusDescription}>Expected by 10:50 AM</Text>
                        </View>
                    </View>
                </View>

                {/* Order Details Preview */}
                <TouchableOpacity style={styles.detailsPreview} onPress={() => router.replace('/(tabs)/orders')}>
                    <View style={styles.previewLeft}>
                        <View style={styles.itemsIconBg}>
                            <Package size={20} color="#6B7280" />
                        </View>
                        <View>
                            <Text style={styles.previewTitle}>Fresh Order from NimBasket</Text>
                            <Text style={styles.previewSubtitle}>Total Paid: ₹{totalPrice || '0.00'}</Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        padding: 8,
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    orderId: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        marginTop: 2,
    },
    moreBtn: {
        padding: 8,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    batchSection: {
        margin: 16,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
    },
    batchGradient: {
        padding: 20,
    },
    batchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    pulseContainer: {
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusPulse: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(34, 197, 94, 0.4)',
    },
    statusInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#22C55E',
    },
    batchStatusText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: 0.3,
    },
    batchItemsContainer: {
        gap: 12,
    },
    batchItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#FED7AA',
    },
    batchItemTexts: {
        flex: 1,
    },
    batchItemTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    batchItemMeta: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    driverCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        margin: 16,
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
    },
    driverTexts: {
        marginLeft: 12,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    driverRole: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginTop: 2,
    },
    driverActions: {
        flexDirection: 'row',
    },
    actionCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF7ED',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 20,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 0,
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
    detailsPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        margin: 16,
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    previewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemsIconBg: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    previewTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    previewSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    orderIdBold: {
        fontSize: 14,
        fontWeight: '900',
        color: '#F97316',
        marginTop: 2,
    },
    bigBoldPrice: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
    },
});

