import '../../domain/entities/battle_history_item.dart';

class BattleHistoryItemModel extends BattleHistoryItem {
  BattleHistoryItemModel({
    required super.opponentNickname,
    required super.result,
    required super.date,
    super.reason,
  });

  factory BattleHistoryItemModel.fromJson(Map<String, dynamic> json) {
    return BattleHistoryItemModel(
      opponentNickname: json['opponentNickname'] ?? 'Unknown',
      result: json['result'] ?? 'loss',
      date: DateTime.tryParse(json['date'] ?? '') ?? DateTime.now(),
      reason: json['reason'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'opponentNickname': opponentNickname,
      'result': result,
      'date': date.toIso8601String(),
      'reason': reason,
    };
  }
}
