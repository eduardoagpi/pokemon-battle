import '../entities/battle_history_item.dart';

abstract class BattleHistoryRepository {
  Future<List<BattleHistoryItem>> getBattleHistory(String nickname);
}
