/**
 * Google Analytics Event Tracking Utility
 * 
 * Tracks button clicks and link interactions
 * Events automatically appear in Google Analytics under Events
 */

export const trackEvent = (eventName, eventCategory, eventLabel, value = null) => {
  // Check if gtag is available (Google Analytics is loaded)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      value: value,
    });
  }
};

// Convenience functions for common event types
export const trackButtonClick = (buttonName, location = 'unknown') => {
  trackEvent('button_click', 'engagement', buttonName, null);
  trackEvent('click', 'button', `${location} - ${buttonName}`);
};

export const trackLinkClick = (linkText, linkUrl, location = 'unknown') => {
  trackEvent('link_click', 'engagement', linkText, null);
  trackEvent('click', 'link', `${location} - ${linkText}`, null);
  // Also track outbound links
  if (typeof window !== 'undefined' && linkUrl && linkUrl.startsWith('http') && !linkUrl.includes(window.location.hostname)) {
    trackEvent('click', 'outbound_link', linkUrl);
  }
};

export const trackNavigationClick = (navItem, location = 'unknown') => {
  trackEvent('navigation_click', 'navigation', navItem, null);
  trackEvent('click', 'nav', `${location} - ${navItem}`);
};

export const trackEmailClick = (emailAddress) => {
  trackEvent('email_click', 'contact', emailAddress);
  trackEvent('click', 'email', emailAddress);
};

export const trackPhoneClick = (phoneNumber) => {
  trackEvent('phone_click', 'contact', phoneNumber);
  trackEvent('click', 'phone', phoneNumber);
};

export const trackSocialClick = (platform, url) => {
  trackEvent('social_click', 'social', platform);
  trackEvent('click', 'social', `${platform} - ${url}`);
};

