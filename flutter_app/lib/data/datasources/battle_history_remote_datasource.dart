import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/battle_history_item_model.dart';
import '../../domain/repositories/general_repository.dart';

class BattleHistoryRemoteDataSource {
  final GeneralRepository generalRepository;

  BattleHistoryRemoteDataSource({required this.generalRepository});

  Future<List<BattleHistoryItemModel>> getBattleHistory(String nickname) async {
    String baseUrl = const String.fromEnvironment('WEB_BATTLE_SERVER');
    final httpUrl = baseUrl.replaceFirst('ws', 'http');

    try {
      final response = await http.get(Uri.parse('$httpUrl/history/$nickname'));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data
            .map((json) => BattleHistoryItemModel.fromJson(json))
            .toList();
      } else {
        throw Exception(
          'Failed to load battle history: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Error fetching battle history: $e');
    }
  }
}
