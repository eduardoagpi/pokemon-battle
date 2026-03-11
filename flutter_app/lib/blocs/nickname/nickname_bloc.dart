import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/usecases/get_random_pokemons.dart';
import 'nickname_event.dart';
import 'nickname_state.dart';

class NicknameBloc extends Bloc<NicknameEvent, NicknameState> {
  final GetRandomPokemonsUseCase getRandomPokemonsUseCase;

  NicknameBloc({required this.getRandomPokemonsUseCase})
    : super(const NicknameState()) {
    on<NicknameChanged>(_onNicknameChanged);
    on<NicknameSubmitted>(_onNicknameSubmitted);
  }

  void _onNicknameChanged(NicknameChanged event, Emitter<NicknameState> emit) {
    emit(
      state.copyWith(nickname: event.nickname, status: NicknameStatus.initial),
    );
  }

  void _onNicknameSubmitted(
    NicknameSubmitted event,
    Emitter<NicknameState> emit,
  ) async {
    if (state.nickname.trim().isEmpty) {
      emit(
        state.copyWith(
          status: NicknameStatus.failure,
          errorMessage: 'Nickname cannot be empty',
        ),
      );
      return;
    }

    emit(state.copyWith(status: NicknameStatus.loading));

    try {
      await getRandomPokemonsUseCase.execute(state.nickname);
      emit(state.copyWith(status: NicknameStatus.success));
    } catch (e) {
      emit(
        state.copyWith(
          status: NicknameStatus.failure,
          errorMessage: e.toString(),
        ),
      );
    }
  }
}
