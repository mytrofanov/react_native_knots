import { TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { useState, useEffect } from 'react';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true
});

let clickCounter = 0;

export const showInterstitialAd = () => {
    clickCounter += 1;
};

const Banner = () => {
    const [interstitialLoaded, setInterstitialLoaded] = useState(false);

    const loadInterstitial = () => {
        const unsubscribeLoaded = interstitial.addAdEventListener(
            AdEventType.LOADED,
            () => {
                setInterstitialLoaded(true);
            }
        );

        const unsubscribeClosed = interstitial.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                setInterstitialLoaded(false);
                interstitial.load();
            }
        );

        interstitial.load();

        return () => {
            unsubscribeClosed();
            unsubscribeLoaded();
        }
    }

    useEffect(() => {
        if (!interstitial) return;
        const unsubscribeInterstitialEvents = loadInterstitial();

        return () => {
            unsubscribeInterstitialEvents();
        };
    }, [])

    useEffect( ()=>{
        if (interstitialLoaded && clickCounter === 10) {
        const timer = setInterval(async () => {
                await interstitial.show();
                clickCounter = 0;
        }, 1000);

        return () => {
            clearInterval(timer);
        };
        }
    },[interstitialLoaded, clickCounter])

    return (
        <></>
    );
}

export default Banner;
