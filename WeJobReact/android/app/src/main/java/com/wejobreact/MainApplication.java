package com.wejobreact;

import android.app.Application;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.content.res.Configuration;
import android.util.Base64;
import android.util.Log;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.rnfs.RNFSPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

import io.fabric.sdk.android.Fabric;

import java.security.MessageDigest;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import com.smixx.fabric.FabricPackage;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFirebasePackage(),
            new ExtraDimensionsPackage(),
            new AsyncStoragePackage(),
            new RNFSPackage(),
            new ReactNativeDocumentPicker(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new FBSDKPackage(mCallbackManager),
            new FabricPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());

    try {

      Locale locale = new Locale("he");
      Locale.setDefault(locale);
      Configuration config = new Configuration();
      config.locale = locale;
      getApplicationContext().getResources().updateConfiguration(config, getApplicationContext().getResources().getDisplayMetrics());
    } catch (Exception e) {
      Log.d("KeyHash", e.toString());
    }

    SoLoader.init(this, /* native exopackage */ false);
    AppEventsLogger.activateApp(this);

    Log.d("KeyHash:", "blabla start");
    try {
      PackageInfo info = getPackageManager().getPackageInfo(
              "com.wejobreact",
              PackageManager.GET_SIGNATURES);
      for (Signature signature : info.signatures) {
        MessageDigest md = MessageDigest.getInstance("SHA");
        md.update(signature.toByteArray());
        Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
      }
    } catch (Exception e) {
      Log.d("KeyHash:", "blabla end");
    }
  }
}
