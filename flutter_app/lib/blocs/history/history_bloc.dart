import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/usecases/get_battle_history_usecase.dart';
import 'history_event.dart';
import 'history_state.dart';

class HistoryBloc extends Bloc<HistoryEvent, HistoryState> {
  final GetBattleHistoryUseCase getBattleHistoryUseCase;

  HistoryBloc({required this.getBattleHistoryUseCase})
    : super(const HistoryState()) {
    on<SearchNicknameChanged>(_onNicknameChanged);
    on<SearchHistory>(_onSearchHistory);
    on<ClearHistory>(_onClearHistory);
  }

  void _onNicknameChanged(
    SearchNicknameChanged event,
    Emitter<HistoryState> emit,
  ) {
    emit(state.copyWith(nicknameSearch: event.nickname));
  }

  void _onSearchHistory(SearchHistory event, Emitter<HistoryState> emit) async {
    if (state.nicknameSearch.isEmpty) return;

    emit(state.copyWith(status: HistoryStatus.loading));
    try {
      final results = await getBattleHistoryUseCase.execute(
        state.nicknameSearch,
      );
      if (results.isEmpty) {
        emit(state.copyWith(status: HistoryStatus.empty, historyResults: []));
      } else {
        emit(
          state.copyWith(
            status: HistoryStatus.success,
            historyResults: results,
          ),
        );
      }
    } catch (e) {
      emit(
        state.copyWith(
          status: HistoryStatus.failure,
          errorMessage: e.toString(),
        ),
      );
    }
  }

  void _onClearHistory(ClearHistory event, Emitter<HistoryState> emit) {
    emit(const HistoryState());
  }
}
