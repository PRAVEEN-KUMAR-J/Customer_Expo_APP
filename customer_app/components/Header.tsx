import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { Compact } from '@/ui/compact';

interface HeaderProps {
    user: any;
    selectedAddress: any;
    onProfilePress: () => void;
    onAddressPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, selectedAddress, onProfilePress, onAddressPress }) => {
    const BRAND_TEXT = 'NimBasket';
    const greetingByHour = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning ☀️';
        if (h < 17) return 'Good afternoon 🌤️';
        if (h < 21) return 'Good evening 🌙';
        return 'Good night 😴';
    };

    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateX = useRef(new Animated.Value(-28)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleTranslateY = useRef(new Animated.Value(14)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 520,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(titleTranslateX, {
                    toValue: 0,
                    duration: 520,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(subtitleOpacity, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(subtitleTranslateY, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={['#FB923C', '#F97316', '#F23A2C', '#E41E26']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.headerTop}>
                <View style={styles.userProfileSection}>
                    <TouchableOpacity
                        onPress={onProfilePress}
                        activeOpacity={0.8}
                        style={styles.avatarContainer}
                    >
                        <Text style={styles.avatarText}>
                            {(user?.name || 'GU')[0].toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                        <TouchableOpacity onPress={onAddressPress} activeOpacity={0.7}>
                            <View style={styles.addressContainer}>
                                <MapPin size={14} color="rgba(255, 255, 255, 0.95)" style={{ marginRight: 4 }} />
                                <Text style={styles.userAddress} numberOfLines={2}>
                                    {selectedAddress
                                        ? `${selectedAddress.street}, ${selectedAddress.city} - ${selectedAddress.pincode}`
                                        : 'Add delivery address'}
                                </Text>
                                <ChevronDown size={16} color="rgba(255, 255, 255, 0.9)" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.greetingSection}>
                <Animated.View
                    style={[
                        styles.greetingTitleRow,
                        { opacity: titleOpacity, transform: [{ translateX: titleTranslateX }] },
                    ]}
                >
                    <Text style={styles.greetingHi}>{greetingByHour()}</Text>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.greetingTitleRow,
                        { opacity: subtitleOpacity, transform: [{ translateY: subtitleTranslateY }] },
                    ]}
                >
                    <Text style={styles.greetingTitle}>{BRAND_TEXT}</Text>
                </Animated.View>
                <Animated.View
                    style={{
                        opacity: subtitleOpacity,
                        transform: [{ translateY: subtitleTranslateY }],
                    }}
                >
                    <Text style={styles.greetingSubtitle}>Effortless shopping. Excellent speed.</Text>
                </Animated.View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
        paddingBottom: Compact.space.xxl,
        paddingHorizontal: Compact.space.xl,
        position: 'relative',
        overflow: 'hidden',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Compact.space.xl,
    },
    userProfileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: Compact.image.avatar,
        height: Compact.image.avatar,
        borderRadius: Compact.image.avatar / 2,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Compact.space.md,
    },
    avatarText: {
        fontSize: Compact.font.xxl,
        fontWeight: '700',
        color: '#F97316',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: Compact.font.xxxl,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        gap: 4,
    },
    userAddress: {
        fontSize: Compact.font.md,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    greetingSection: {
        marginTop: 8,
    },
    greetingTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    greetingHi: {
        fontSize: Compact.font.lg,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.95)',
        letterSpacing: 0.5,
    },
    greetingTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 3,
    },
    greetingSubtitle: {
        fontSize: Compact.font.md,
        fontWeight: '500',
        letterSpacing: 0.8,
        color: 'rgba(255, 255, 255, 0.92)',
    },
});
