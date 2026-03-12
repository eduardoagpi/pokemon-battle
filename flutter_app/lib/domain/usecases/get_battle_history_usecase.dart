import '../entities/battle_history_item.dart';
import '../repositories/battle_history_repository.dart';

class GetBattleHistoryUseCase {
  final BattleHistoryRepository repository;

  GetBattleHistoryUseCase(this.repository);

  Future<List<BattleHistoryItem>> execute(String nickname) {
    return repository.getBattleHistory(nickname);
  }
}
