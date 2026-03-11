import '../entities/user_session.dart';

abstract class GeneralRepository {
  void saveSession(UserSession session);
  UserSession? getSession();
  void clearSession();
}
