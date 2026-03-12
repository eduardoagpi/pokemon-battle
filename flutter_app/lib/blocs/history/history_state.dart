import 'package:equatable/equatable.dart';
import '../../domain/entities/battle_history_item.dart';

enum HistoryStatus { initial, loading, success, failure, empty }

class HistoryState extends Equatable {
  final HistoryStatus status;
  final String nicknameSearch;
  final List<BattleHistoryItem> historyResults;
  final String? errorMessage;

  const HistoryState({
    this.status = HistoryStatus.initial,
    this.nicknameSearch = '',
    this.historyResults = const [],
    this.errorMessage,
  });

  HistoryState copyWith({
    HistoryStatus? status,
    String? nicknameSearch,
    List<BattleHistoryItem>? historyResults,
    String? errorMessage,
  }) {
    return HistoryState(
      status: status ?? this.status,
      nicknameSearch: nicknameSearch ?? this.nicknameSearch,
      historyResults: historyResults ?? this.historyResults,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [
    status,
    nicknameSearch,
    historyResults,
    errorMessage,
  ];
}
