import '../../domain/entities/battle_history_item.dart';
import '../../domain/repositories/battle_history_repository.dart';
import '../datasources/battle_history_remote_datasource.dart';

class BattleHistoryRepositoryImpl implements BattleHistoryRepository {
  final BattleHistoryRemoteDataSource remoteDataSource;

  BattleHistoryRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<BattleHistoryItem>> getBattleHistory(String nickname) async {
    return await remoteDataSource.getBattleHistory(nickname);
  }
}
