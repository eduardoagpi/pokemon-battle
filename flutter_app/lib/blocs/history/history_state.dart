import 'package:equatable/equatable.dart';

enum HistoryStatus { initial, loading, empty, failure }

class HistoryState extends Equatable {
  final HistoryStatus status;
  final String? errorMessage;

  const HistoryState({this.status = HistoryStatus.initial, this.errorMessage});

  HistoryState copyWith({HistoryStatus? status, String? errorMessage}) {
    return HistoryState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, errorMessage];
}
