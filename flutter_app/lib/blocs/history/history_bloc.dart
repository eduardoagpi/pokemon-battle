import 'package:flutter_bloc/flutter_bloc.dart';
import 'history_event.dart';
import 'history_state.dart';

class HistoryBloc extends Bloc<HistoryEvent, HistoryState> {
  HistoryBloc() : super(const HistoryState()) {
    on<LoadHistory>(_onLoadHistory);
  }

  void _onLoadHistory(LoadHistory event, Emitter<HistoryState> emit) async {
    emit(state.copyWith(status: HistoryStatus.loading));
    // Simulate loading
    await Future.delayed(const Duration(milliseconds: 500));
    emit(state.copyWith(status: HistoryStatus.empty));
  }
}
