import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/pokemon_model.dart';

class PokemonRemoteDataSource {
  final String baseUrl;
  final http.Client client;

  PokemonRemoteDataSource({String? baseUrl, http.Client? client})
    : baseUrl =
          baseUrl ??
          const String.fromEnvironment('WEB_FLUTTER_INITIAL_API_URL'),
      client = client ?? http.Client();

  Future<List<PokemonListItemResponse>> getPokemonList() async {
    final response = await client.get(Uri.parse('$baseUrl/list'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = json.decode(response.body);
      return jsonList
          .map((json) => PokemonListItemResponse.fromJson(json))
          .toList();
    } else {
      throw Exception('Failed to load pokemon list');
    }
  }

  Future<PokemonResponse> getPokemonDetails(int id) async {
    final response = await client.get(Uri.parse('$baseUrl/list/$id'));

    if (response.statusCode == 200) {
      final dynamic jsonMap = json.decode(response.body);
      return PokemonResponse.fromJson(jsonMap);
    } else {
      throw Exception('Failed to load pokemon details for id $id');
    }
  }
}
