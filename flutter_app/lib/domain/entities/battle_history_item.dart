class BattleHistoryItem {
  final String opponentNickname;
  final String result; // 'win' or 'loss'
  final DateTime date;
  final String? reason;

  BattleHistoryItem({
    required this.opponentNickname,
    required this.result,
    required this.date,
    this.reason,
  });
}
