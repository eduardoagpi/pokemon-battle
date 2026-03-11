import '../../domain/entities/user_session.dart';
import '../../domain/repositories/general_repository.dart';

class GeneralRepositoryImpl implements GeneralRepository {
  UserSession? _session;

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
}
