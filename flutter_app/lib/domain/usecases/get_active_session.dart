import '../entities/user_session.dart';
import '../repositories/general_repository.dart';

class GetActiveSessionUseCase {
  final GeneralRepository generalRepository;

  GetActiveSessionUseCase({required this.generalRepository});

  UserSession? execute() {
    return generalRepository.getSession();
  }
}
