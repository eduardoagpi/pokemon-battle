import 'package:equatable/equatable.dart';

abstract class HistoryEvent extends Equatable {
  const HistoryEvent();

  @override
  List<Object> get props => [];
}

class SearchNicknameChanged extends HistoryEvent {
  final String nickname;
  const SearchNicknameChanged(this.nickname);

  @override
  List<Object> get props => [nickname];
}

class SearchHistory extends HistoryEvent {
  const SearchHistory();
}

class ClearHistory extends HistoryEvent {
  const ClearHistory();
}
