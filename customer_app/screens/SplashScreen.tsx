import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    Dimensions,
    Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const LOGO = require('@/assets/nimbasket_logo.png');

export const NimBasketSplash: React.FC = () => {
    // Logo
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoY = useRef(new Animated.Value(30)).current;

    // Brand text
    const nimOpacity = useRef(new Animated.Value(0)).current;
    const nimX = useRef(new Animated.Value(-50)).current;
    const basketTextOpacity = useRef(new Animated.Value(0)).current;
    const basketTextX = useRef(new Animated.Value(50)).current;

    // Tagline
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const taglineY = useRef(new Animated.Value(14)).current;

    // Dots
    const dot1 = useRef(new Animated.Value(0.15)).current;
    const dot2 = useRef(new Animated.Value(0.15)).current;
    const dot3 = useRef(new Animated.Value(0.15)).current;

    // Background orbs
    const orb1 = useRef(new Animated.Value(0.5)).current;
    const orb2 = useRef(new Animated.Value(0.3)).current;

    // Outer ring pulse on logo
    const ringScale = useRef(new Animated.Value(1)).current;
    const ringOpacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        // Ambient orb pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(orb1, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(orb1, { toValue: 0.5, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
        ).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(orb2, { toValue: 0.9, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(orb2, { toValue: 0.3, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
        ).start();

        // Ring ripple on logo
        Animated.loop(
            Animated.parallel([
                Animated.timing(ringScale, { toValue: 1.55, duration: 1600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
                Animated.timing(ringOpacity, { toValue: 0, duration: 1600, useNativeDriver: true }),
            ])
        ).start();

        // Main entrance sequence
        Animated.sequence([
            // 1 – Logo springs up into place
            Animated.parallel([
                Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 5,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(logoY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),

            Animated.delay(120),

            // 2 – "Nim" slides from left & "Basket" from right simultaneously
            Animated.parallel([
                Animated.timing(nimOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
                Animated.timing(nimX, { toValue: 0, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(basketTextOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
                Animated.timing(basketTextX, { toValue: 0, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),

            Animated.delay(140),

            // 3 – Tagline fades up
            Animated.parallel([
                Animated.timing(taglineOpacity, { toValue: 1, duration: 480, useNativeDriver: true }),
                Animated.timing(taglineY, { toValue: 0, duration: 480, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            ]),

            Animated.delay(200),
        ]).start(() => {
            // Staggered dots loop
            const loopDot = (dot: Animated.Value, delay: number) =>
                Animated.loop(
                    Animated.sequence([
                        Animated.delay(delay),
                        Animated.timing(dot, { toValue: 1, duration: 360, useNativeDriver: true }),
                        Animated.timing(dot, { toValue: 0.15, duration: 360, useNativeDriver: true }),
                    ])
                ).start();

            loopDot(dot1, 0);
            loopDot(dot2, 220);
            loopDot(dot3, 440);
        });
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Ambient background orbs */}
            <Animated.View style={[styles.orb1, { transform: [{ scale: orb1 }] }]} />
            <Animated.View style={[styles.orb2, { transform: [{ scale: orb2 }] }]} />

            <View style={styles.centerContent}>

                {/* Logo image */}
                <View style={styles.logoWrap}>
                    {/* Ripple ring behind logo */}
                    <Animated.View
                        style={[
                            styles.rippleRing,
                            { opacity: ringOpacity, transform: [{ scale: ringScale }] },
                        ]}
                    />
                    {/* White circle bg for the logo */}
                    <Animated.View
                        style={[
                            styles.logoBg,
                            {
                                opacity: logoOpacity,
                                transform: [{ scale: logoScale }, { translateY: logoY }],
                            },
                        ]}
                    >
                        <Image
                            source={LOGO}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </View>

                {/* Brand name row */}
                <View style={styles.brandRow}>
                    <Animated.Text
                        style={[
                            styles.brandNim,
                            { opacity: nimOpacity, transform: [{ translateX: nimX }] },
                        ]}
                    >
                        Nim
                    </Animated.Text>
                    <Animated.Text
                        style={[
                            styles.brandBasket,
                            { opacity: basketTextOpacity, transform: [{ translateX: basketTextX }] },
                        ]}
                    >
                        Basket
                    </Animated.Text>
                </View>

                {/* Tagline */}
                <Animated.Text
                    style={[
                        styles.tagline,
                        { opacity: taglineOpacity, transform: [{ translateY: taglineY }] },
                    ]}
                >
                    Effortless shopping. Excellent speed.
                </Animated.Text>

                {/* Loading dots */}
                <View style={styles.dotsRow}>
                    {[dot1, dot2, dot3].map((dot, i) => (
                        <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />
                    ))}
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>🌿 Fresh · Fast · Reliable</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D1117',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orb1: {
        position: 'absolute',
        width: 380,
        height: 380,
        borderRadius: 190,
        backgroundColor: 'rgba(249, 115, 22, 0.12)',
        top: -80,
        right: -90,
    },
    orb2: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(228, 30, 38, 0.08)',
        bottom: 80,
        left: -80,
    },
    centerContent: {
        alignItems: 'center',
    },
    logoWrap: {
        width: 140,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    rippleRing: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: 'rgba(249, 115, 22, 0.5)',
    },
    logoBg: {
        width: 120,
        height: 120,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#E41E26',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 12,
    },
    logoImage: {
        width: 88,
        height: 88,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    brandNim: {
        fontSize: 52,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    brandBasket: {
        fontSize: 52,
        fontWeight: '300',
        color: '#F97316',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: 0.7,
        fontWeight: '500',
        marginBottom: 44,
        textAlign: 'center',
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F97316',
    },
    footer: {
        position: 'absolute',
        bottom: 44,
    },
    footerText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: 0.5,
    },
});
