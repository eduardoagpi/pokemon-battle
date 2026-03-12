import 'package:shared_preferences/shared_preferences.dart';
import '../../domain/entities/user_session.dart';
import '../../domain/repositories/general_repository.dart';

class GeneralRepositoryImpl implements GeneralRepository {
  UserSession? _session;
  SharedPreferences? _prefs;
  static const String _apiUrlKey = 'api_url';

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  @override
  void saveSession(UserSession session) {
    _session = session;
  }

  @override
  UserSession? getSession() {
    return _session;
  }

  @override
  void clearSession() {
    _session = null;
  }

  @override
  String? getApiUrl() {
    final savedUrl = _prefs?.getString(_apiUrlKey);
    if (savedUrl != null && savedUrl.isNotEmpty) {
      return savedUrl;
    }
    return const String.fromEnvironment('WEB_FLUTTER_INITIAL_API_URL');
  }

  @override
  Future<void> saveApiUrl(String url) async {
    await _prefs?.setString(_apiUrlKey, url);
  }
}
